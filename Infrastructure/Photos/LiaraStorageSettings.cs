namespace Infrastructure.Photos
{
    public class LiaraStorageSettings
    {
        public required string Endpoint { get; set; }
        public required string BucketName { get; set; }
        public required string AccessKey { get; set; }
        public required string SecretKey { get; set; }
    }
}