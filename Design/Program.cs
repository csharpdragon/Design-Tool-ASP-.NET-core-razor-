using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Design.Data;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddDbContext<DesignImageModelContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DesignImageModelContext") ?? throw new InvalidOperationException("Connection string 'DesignImageModelContext' not found.")));

builder.Services.AddServerSideBlazor();
builder.Services.AddControllers();
builder.Services.AddSession(option =>
{
    option.Cookie.Name = "forUserSettion";
    option.IdleTimeout = TimeSpan.MaxValue;
    option.Cookie.IsEssential = true;
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseCors(builder => {
        builder.AllowAnyMethod();
        builder.AllowAnyOrigin();
        builder.AllowAnyHeader();
    });
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseSession();
app.UseAuthorization();

app.MapRazorPages();

app.MapBlazorHub();
app.MapControllers();
app.Run();
