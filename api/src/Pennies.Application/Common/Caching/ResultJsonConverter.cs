using System.Text.Json;
using System.Text.Json.Serialization;

namespace Pennies.Application.Common.Caching;

public sealed class ResultJsonConverterFactory : JsonConverterFactory
{
    public override bool CanConvert(Type typeToConvert) =>
        typeToConvert.IsGenericType && typeToConvert.GetGenericTypeDefinition() == typeof(Result<>);

    public override JsonConverter? CreateConverter(Type typeToConvert, JsonSerializerOptions options)
    {
        var valueType = typeToConvert.GetGenericArguments()[0];
        var converterType = typeof(ResultJsonConverter<>).MakeGenericType(valueType);
        return (JsonConverter)Activator.CreateInstance(converterType)!;
    }
}

internal sealed class ResultJsonConverter<T> : JsonConverter<Result<T>>
{
    public override Result<T> Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        using var doc = JsonDocument.ParseValue(ref reader);
        var root = doc.RootElement;

        var isSuccess = root.GetProperty("IsSuccess").GetBoolean();
        if (isSuccess)
        {
            var value = root.GetProperty("Value").Deserialize<T>(options)!;
            return Result<T>.Success(value);
        }

        var error = root.GetProperty("Error").Deserialize<Error>(options)!;
        return Result<T>.Failure(error);
    }

    public override void Write(Utf8JsonWriter writer, Result<T> value, JsonSerializerOptions options)
    {
        writer.WriteStartObject();
        writer.WriteBoolean("IsSuccess", value.IsSuccess);
        writer.WriteBoolean("IsFailure", value.IsFailure);
        writer.WritePropertyName("Value");
        JsonSerializer.Serialize(writer, value.Value, options);
        writer.WritePropertyName("Error");
        JsonSerializer.Serialize(writer, value.Error, options);
        writer.WriteEndObject();
    }
}
