using Pennies.Application.Common;

namespace Pennies.Api.Extensions;

public static class ResultExtensions
{
    public static IResult ToHttpResult<T>(this Result<T> result, int successCode = 200) =>
        result.IsSuccess
            ? successCode switch
            {
                201 => Results.Created(string.Empty, result.Value),
                _ => Results.Ok(result.Value),
            }
            : result.Error.Code switch
            {
                "NotFound" => Results.NotFound(result.Error),
                "Conflict" => Results.Conflict(result.Error),
                "Unauthorized" => Results.Unauthorized(),
                _ => Results.BadRequest(result.Error),
            };
}
