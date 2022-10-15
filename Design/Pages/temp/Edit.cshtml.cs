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

namespace Design.Pages.temp
{
    public class EditModel : PageModel
    {
        private readonly Design.Data.DesignImageModelContext _context;

        public EditModel(Design.Data.DesignImageModelContext context)
        {
            _context = context;
        }

        [BindProperty]
        public ImagesInfo ImagesInfo { get; set; } = default!;

        public async Task<IActionResult> OnGetAsync(int? id)
        {
            if (id == null || _context.ImagesInfo == null)
            {
                return NotFound();
            }

            var imagesinfo =  await _context.ImagesInfo.FirstOrDefaultAsync(m => m.ID == id);
            if (imagesinfo == null)
            {
                return NotFound();
            }
            ImagesInfo = imagesinfo;
            return Page();
        }

        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see https://aka.ms/RazorPagesCRUD.
        public async Task<IActionResult> OnPostAsync()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            _context.Attach(ImagesInfo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ImagesInfoExists(ImagesInfo.ID))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return RedirectToPage("./Index");
        }

        private bool ImagesInfoExists(int id)
        {
          return _context.ImagesInfo.Any(e => e.ID == id);
        }
    }
}
