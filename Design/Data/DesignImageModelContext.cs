using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Design.Models;

namespace Design.Data
{
    public class DesignImageModelContext : DbContext
    {
        public DesignImageModelContext (DbContextOptions<DesignImageModelContext> options)
            : base(options)
        {
        }

        public DbSet<Design.Models.ImagesInfo> ImagesInfo { get; set; } = default!;
    }
}
