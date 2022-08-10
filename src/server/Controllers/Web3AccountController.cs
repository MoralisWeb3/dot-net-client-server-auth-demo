//using Microsoft.AspNetCore.Mvc;
//using Moralis;
//using Moralis.Network;
//using Moralis.Web3Api.Models;

//namespace MoralisDemo.Controllers
//{
//    [ApiController]
//    [Route("[controller]")]
//    public class Web3AccountController : ControllerBase
//    {
//        [HttpGet, Route("{address}/balance")]
//        public async Task<IActionResult> Balance(string address, ChainList chainId)
//        {
//            try
//            {
//                NativeBalance bal = await MoralisClient.Web3Api.Account.GetNativeBalance(address, chainId);

//                return new OkObjectResult(bal);
//            }
//            catch (ApiException ex)
//            {
//                return new BadRequestResult();
//            }
//            catch (Exception ex)
//            {
//                return new StatusCodeResult((int)System.Net.HttpStatusCode.InternalServerError);
//            }
//        }
//    }
//}
