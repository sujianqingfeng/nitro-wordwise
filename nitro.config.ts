//https://nitro.unjs.io/config
export default defineNitroConfig({
	srcDir: "server",
	experimental: {
		asyncContext: true,
	},
	vercel: {
		functions: {
			maxDuration: 60,
		},
	},
})
