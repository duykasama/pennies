namespace Pennies.Worker;

public sealed class SmtpOptions
{
    public string Host { get; set; } = "localhost";
    public int Port { get; set; } = 587;
    public string? Username { get; set; }
    public string? Password { get; set; }
    public string From { get; set; } = "noreply@pennies.app";
    public bool UseSsl { get; set; } = true;
}
