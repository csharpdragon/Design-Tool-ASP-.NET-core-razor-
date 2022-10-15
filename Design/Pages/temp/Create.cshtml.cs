using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc.Rendering;
using Design.Data;
using Design.Models;

namespace Design.Pages.temp
{
    public class CreateModel : PageModel
    {
        private readonly Design.Data.DesignImageModelContext _context;

        public CreateModel(Design.Data.DesignImageModelContext context)
        {
            _context = context;
        }

        public IActionResult OnGet()
        {
            return Page();
        }

        [BindProperty]
        public ImagesInfo ImagesInfo { get; set; }
        

        // To protect from overposting attacks, see https://aka.ms/RazorPagesCRUD
        public async Task<IActionResult> OnPostAsync()
        {
          if (!ModelState.IsValid)
            {
                return Page();
            }

            _context.ImagesInfo.Add(ImagesInfo);
            await _context.SaveChangesAsync();

            return RedirectToPage("./Index");
        }
    }
}
