import { createFileRoute } from "@tanstack/react-router";
import FileExplorer from "@/components/file-explorer/FileExplorer";

function FileExplorerPage() {
  return <FileExplorer />;
}

export const Route = createFileRoute("/file-explorer")({
  component: FileExplorerPage,
});
