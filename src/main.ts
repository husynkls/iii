import * as BunnySDK from "https://esm.sh/@bunny.net/edgescript-sdk@0.11.1";
import * as UA from "https://esm.sh/ua-parser-js@1.0.39";

console.log("Starting server...");

BunnySDK.net.http.servePullZone({ url: "https://echo.free.beeceptor.com/" })
  .onOriginRequest(
    (ctx) => {
      ctx.request.headers.set("mobile", "true");
      const ua = ctx.request.headers.get("User-Agent") ?? navigator.userAgent;
      const parser = new UA.UAParser(ua);
      const device = parser.getDevice().type;
      switch (device) {
        case "mobile":
          ctx.request.headers.set("isMobile", "true");
          break;
        case "tablet":
          ctx.request.headers.set("isTablet", "true");
          break;
        default:
          break;
      }

      return Promise.resolve(ctx.request);
    },
  ).onOriginResponse(async (ctx) => {
    const body = await ctx.response.json();
    body.ip = "Redacted";
    body.headers["User-Agent"] = "RedactedUA";
    return new Response(JSON.stringify(body, null, 2));
  });
