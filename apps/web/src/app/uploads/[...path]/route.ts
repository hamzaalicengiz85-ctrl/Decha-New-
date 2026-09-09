import { serveUpload } from "@decha/content/server";

/** Yüklenen görseller depo kökündeki content/uploads klasöründen servis edilir. */
export async function GET(
  _request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return serveUpload(path);
}
