using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Design.Data;
using Design.Models;

namespace Design.Pages
{
    public class IndexModel : PageModel
    {
        private readonly Design.Data.DesignImageModelContext _context;

        private readonly ILogger<IndexModel> _logger;

        private IWebHostEnvironment hostEnv;

        

        public IndexModel(ILogger<IndexModel> logger, IWebHostEnvironment hostEnv, DesignImageModelContext context)
        {
            _logger = logger;
            this.hostEnv = hostEnv;
            _context = context;
        }
        [BindProperty]
        public ImagesInfo ImagesInfo { get; set; }
        [BindProperty]
        public IList<ImagesInfo> ImagesInfoList { get; set; } = default!;
        [BindProperty]
        public List<int> fontSizeArray { get; set; } = default!;
      
        public int mode = -1;
        public void Mode1()
        {
            mode = 1;
        }
        public void Mode2()
        {
            mode = 2;
        }
        //       public void OnGetMode1()
        //       {
        //           mode = 0;
        //            return Page();
        //        }
        //        public void OnGetMode2()
        //        {
        //            mode = 1;
        //            return Page();
        //       }
        public async Task<IActionResult> OnPostUpload(IFormFile file)
        {
            var fileDic = "Files";
            string filepath = Path.Combine(hostEnv.WebRootPath,fileDic);
            if(!Directory.Exists(filepath))
                Directory.CreateDirectory(filepath);


//            var lastinfo = await _context.ImagesInfo.OrderBy(m => m.ID).LastOrDefaultAsync();

            var sesssionName = HttpContext.Session.GetString("forUserInfo");
            var fileName = sesssionName + "_" +file.FileName.Replace(' ','_');

            filepath = Path.Combine(filepath,fileName);
            using (FileStream fs = System.IO.File.Create(filepath))
            {
                file.CopyTo(fs);
            }
            ImagesInfo addedInfo = new ImagesInfo();
            addedInfo.Name = fileName;
            addedInfo.UploadedDate = DateTime.Now;
            addedInfo.SesssionName = sesssionName!;
            _context.ImagesInfo.Add(addedInfo);
            await _context.SaveChangesAsync();
            await RefreshImageList();
            return Page();
        }

        public static string generateRandoemUserInfo()
        {
            var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var stringChars = new char[64];
            var random = new Random();
            
            for (int i = 0; i < stringChars.Length; i++)
            {
                stringChars[i] = chars[random.Next(chars.Length)];
            }

            var finalString = new String(stringChars);
            return finalString;
        }
        public async Task OnGetAsync()
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString("forUserInfo")))
            {
                var randomString = generateRandoemUserInfo();
                HttpContext.Session.SetString("forUserInfo", randomString);
            }
            init();
            await RefreshImageList();
        }

        public void init()
        {
            fontSizeArray = new List<int> { 7, 8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 30, 36, 48, 60, 72, 96 };
        }
        public async Task RefreshImageList()
        {
            var name = HttpContext.Session.GetString("forUserInfo");

            _logger.LogInformation("Session Name: {forUserInfo}", name);

            if (_context.ImagesInfo != null)
            {
                ImagesInfoList = await _context.ImagesInfo.Where(m => m.SesssionName == name).ToListAsync();
            }
        }
    }
}