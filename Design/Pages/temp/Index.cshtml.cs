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
    public class IndexModel : PageModel
    {
        private readonly Design.Data.DesignImageModelContext _context;

        public IndexModel(Design.Data.DesignImageModelContext context)
        {
            _context = context;
        }

        public IList<ImagesInfo> ImagesInfo { get;set; } = default!;

        public async Task OnGetAsync()
        {
            if (_context.ImagesInfo != null)
            {
                ImagesInfo = await _context.ImagesInfo.ToListAsync();
            }
        }
    }
}
