using Amazon.S3;
using Amazon.S3.Model;
using Application.Interfaces;
using Application.Profiles.DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace Infrastructure.Photos
{
    public class S3PhotoService : IPhotoService
    {
        private readonly IAmazonS3 _s3Client;
        private readonly LiaraStorageSettings _settings;

        public S3PhotoService(IOptions<LiaraStorageSettings> config)
        {
            _settings = config.Value;

            var s3Config = new AmazonS3Config
            {
                ServiceURL = _settings.Endpoint,
                ForcePathStyle = true,
            };

            _s3Client = new AmazonS3Client(_settings.AccessKey, _settings.SecretKey, s3Config);
        }

        public async Task<PhotoUploadResult?> UploadUserPhoto(IFormFile file)
        {
            return await UploadPhoto(file, "profiles");
        }

        public async Task<PhotoUploadResult?> UploadEventPhoto(IFormFile file)
        {
            return await UploadPhoto(file, "events");
        }

        private async Task<PhotoUploadResult?> UploadPhoto(IFormFile file, string folder)
        {
            if (file.Length <= 0)
                return null;

            var extension = Path.GetExtension(file.FileName);
            var key = $"{folder}/{Guid.NewGuid()}{extension}";

            await using var stream = file.OpenReadStream();

            var putRequest = new PutObjectRequest
            {
                BucketName = _settings.BucketName,
                Key = key,
                InputStream = stream,
                ContentType = file.ContentType,
            };

            var response = await _s3Client.PutObjectAsync(putRequest);

            if (response.HttpStatusCode != System.Net.HttpStatusCode.OK)
                throw new Exception("Failed to upload photo to storage.");

            // NOTE: We deliberately do NOT return the direct Liara storage URL here
            // (e.g. https://storage.c2.liara.site/bucket/key). Liara's default
            // storage domain does not support public/shareable direct access
            // without a custom domain attached to the bucket, which this project
            // does not have. Instead, we return a relative URL pointing to our own
            // PhotosController, which proxies the file through the backend using
            // our S3 access keys (which always work, regardless of domain setup).
            var url = $"/api/photos/{key}";

            return new PhotoUploadResult
            {
                PublicId = key, // we reuse PublicId field to store the S3 "key" (path)
                Url = url,
            };
        }

        public async Task<string> DeletePhoto(string publicId)
        {
            var deleteRequest = new DeleteObjectRequest
            {
                BucketName = _settings.BucketName,
                Key = publicId, // publicId here is actually the S3 key we stored
            };

            var response = await _s3Client.DeleteObjectAsync(deleteRequest);

            // S3 delete doesn't return a descriptive "ok" result like Cloudinary,
            // so we just confirm no exception was thrown.
            return "ok";
        }
    }
}
