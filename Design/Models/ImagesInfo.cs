using System.ComponentModel.DataAnnotations;

namespace Design.Models
{
    public class ImagesInfo
    {
        public int ID { get; set; }
        public string Name { get; set; }

        public int UserId { get; set; }
        public string SesssionName { get; set; }

        [DataType(DataType.Date)]
        public DateTime UploadedDate { get; set; }
    }
}
