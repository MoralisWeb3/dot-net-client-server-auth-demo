var AllowedOrigins = "_allowedOrigins";

var builder = WebApplication.CreateBuilder(args);

// Define CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy(AllowedOrigins,
                    policy =>
                    {
                        policy.WithOrigins("http://127.0.0.1:5500")
                                            .AllowAnyHeader()
                                            .AllowAnyMethod();
                    });
});

// Add services to the container.
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Enable CORS policy
app.UseCors(AllowedOrigins);

app.UseAuthorization();

app.MapControllers();

// Setup Moralis Client
Moralis.MoralisClient.ConnectionData = new Moralis.Models.ServerConnectionData()
{
    ApiKey = "MY API KEY"
};

app.Run();
