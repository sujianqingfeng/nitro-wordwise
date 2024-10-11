import type { AsyncIterableStream } from "~/services/ai/provider.interface"
import type { EventStream } from "h3"

export async function readTextStreamToH3EventStream(
	textStream: AsyncIterableStream<string>,
	eventStream: EventStream,
) {
	eventStream.onClosed(async () => {
		await eventStream.close()
	})

	const reader = textStream.getReader()
	let done = false
	while (!done) {
		const { value, done: readerDone } = await reader.read()
		if (readerDone) {
			done = true
		} else {
			eventStream.push(value)
		}
	}

	reader.releaseLock()
	eventStream.close()
}
