using Amazon.S3;
using Amazon.S3.Model;
using Infrastructure.Photos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace API.Controllers
{
    // Proxies image files from Liara Object Storage through our own backend.
    // Why this exists: Liara's default storage domain (storage.c2.liara.site)
    // does not support public/shareable direct access without a custom domain
    // attached to the bucket. Since we don't have a custom domain, we instead
    // fetch the file server-side (using our S3 access keys, which always work)
    // and stream it back to the client through our own already-public API domain.
    //
    // Because BaseApiController already applies [Route("api/[controller]")],
    // this controller is automatically reachable at: /api/photos/{**key}
    public class PhotosController : BaseApiController
    {
        private readonly IAmazonS3 _s3Client;
        private readonly LiaraStorageSettings _settings;

        public PhotosController(IOptions<LiaraStorageSettings> config)
        {
            _settings = config.Value;

            var s3Config = new AmazonS3Config
            {
                ServiceURL = _settings.Endpoint,
                ForcePathStyle = true,
            };

            _s3Client = new AmazonS3Client(_settings.AccessKey, _settings.SecretKey, s3Config);
        }

        // Matches routes like: /api/photos/profiles/abc123.jpg
        // or:                  /api/photos/events/xyz789.jpg
        // The {**key} wildcard captures the full path (including the folder segment)
        // exactly as it was stored as the S3 object key.
        [AllowAnonymous]
        [HttpGet("{**key}")]
        public async Task<IActionResult> GetPhoto(string key)
        {
            try
            {
                var request = new GetObjectRequest { BucketName = _settings.BucketName, Key = key };

                using var response = await _s3Client.GetObjectAsync(request);

                // Copy the S3 object stream into memory before returning it, since
                // the underlying S3 response stream gets disposed once this method
                // returns (the 'using' above), but ASP.NET Core streams the file
                // response asynchronously after the action method completes.
                var memoryStream = new MemoryStream();
                await response.ResponseStream.CopyToAsync(memoryStream);
                memoryStream.Position = 0;

                return File(memoryStream, response.Headers.ContentType);
            }
            catch (AmazonS3Exception ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return NotFound();
            }
        }
    }
}
