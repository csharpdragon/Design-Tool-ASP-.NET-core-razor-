using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Design.Data;
using Design.Models;

namespace Design.Pages.temp
{
    public class DetailsModel : PageModel
    {
        private readonly Design.Data.DesignImageModelContext _context;

        public DetailsModel(Design.Data.DesignImageModelContext context)
        {
            _context = context;
        }

      public ImagesInfo ImagesInfo { get; set; }

        public async Task<IActionResult> OnGetAsync(int? id)
        {
            if (id == null || _context.ImagesInfo == null)
            {
                return NotFound();
            }

            var imagesinfo = await _context.ImagesInfo.FirstOrDefaultAsync(m => m.ID == id);
            if (imagesinfo == null)
            {
                return NotFound();
            }
            else 
            {
                ImagesInfo = imagesinfo;
            }
            return Page();
        }
    }
}
