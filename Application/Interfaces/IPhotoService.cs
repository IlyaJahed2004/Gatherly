using Application.Profiles.DTOs;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface IPhotoService
    {
        Task<PhotoUploadResult?> UploadUserPhoto(IFormFile file);
        Task<PhotoUploadResult?> UploadEventPhoto(IFormFile file);
        Task<string> DeletePhoto(string publicId);
    }
}
