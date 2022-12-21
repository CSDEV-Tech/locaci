import { Meta } from "~/features/shared/components/meta";
import type { HeadProps } from "~/types";

export default function Head({ params }: HeadProps<{ uid: string }>) {
  return (
    <Meta
      title="Editer une annonce"
      pathname={`/owner/properties/edit/${params.uid}`}
    />
  );
}
