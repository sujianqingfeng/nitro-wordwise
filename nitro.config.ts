//https://nitro.unjs.io/config
export default defineNitroConfig({
 srcDir: "server",

 experimental: {
					asyncContext: true,
	},

 compatibilityDate: "2024-06-30",
})