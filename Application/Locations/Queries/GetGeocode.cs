using Application.Core;
using Application.Locations.DTOs;
using MediatR;
using System.Text.Json;
using System.Web;

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
        private const string ApiKey = "b46f8baf26ed4cd5a41db5b119ffcddd";

        public async Task<Result<GeocodeResultDto>> Handle(
            Query request,
            CancellationToken cancellationToken)
        {
            var client = httpClientFactory.CreateClient("GeocodingService");

            var encodedCity = HttpUtility.UrlEncode(request.City);

            var url = $"geocode/v1/json?q={encodedCity}&key={ApiKey}&limit=1";

            var response = await client.GetAsync(url, cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                return Result<GeocodeResultDto>.Failure(
                    "Failed to reach geocoding service.",
                    (int)response.StatusCode);
            }

            var content = await response.Content.ReadAsStringAsync(cancellationToken);

            using var document = JsonDocument.Parse(content);

            if (!document.RootElement.TryGetProperty("results", out var results) ||
                results.GetArrayLength() == 0)
            {
                return Result<GeocodeResultDto>.Failure(
                    "City not found.",
                    404);
            }

            var firstResult = results[0];
            var geometry = firstResult.GetProperty("geometry");

            var resultDto = new GeocodeResultDto
            {
                Lat = geometry.GetProperty("lat").GetDouble(),
                Lng = geometry.GetProperty("lng").GetDouble()
            };

            return Result<GeocodeResultDto>.Success(resultDto);
        }
    }
}