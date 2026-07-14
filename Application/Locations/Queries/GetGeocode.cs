using Application.Core;
using Application.Locations.DTOs;
using MediatR;
using System.Globalization;
using System.Text.Json;

namespace Application.Locations.Queries;

public class GetGeocode
{
    public class Query : IRequest<Result<GeocodeResultDto>>
    {
        public required string City { get; set; }
    }

    public class Handler(IHttpClientFactory httpClientFactory)
        : IRequestHandler<Query, Result<GeocodeResultDto>>
    {
        public async Task<Result<GeocodeResultDto>> Handle(
            Query request,
            CancellationToken cancellationToken)
        {
            var client = httpClientFactory.CreateClient("Neshan");

            var payload = JsonSerializer.Serialize(new
            {
                address = request.City
            });

            var url = $"geocoding/v1?json={Uri.EscapeDataString(payload)}";

            var response = await client.GetAsync(url, cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                return Result<GeocodeResultDto>.Failure(
                    "Failed to reach geocoding service.",
                    400);
            }

            var content = await response.Content.ReadAsStringAsync(cancellationToken);

            using var document = JsonDocument.Parse(content);

            if (!document.RootElement.TryGetProperty("items", out var items) ||
                items.GetArrayLength() == 0)
            {
                return Result<GeocodeResultDto>.Failure(
                    "City not found.",
                    404);
            }

            var item = items[0];

            var location = item.GetProperty("location");

            var result = new GeocodeResultDto
            {
                Lat = location.GetProperty("latitude").GetDouble(),
                Lng = location.GetProperty("longitude").GetDouble()
            };

            return Result<GeocodeResultDto>.Success(result);
        }
    }
}

