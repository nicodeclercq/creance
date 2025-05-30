import { PageTemplate } from "../shared/PageTemplate/PageTemplate";
import { useStore } from "../store/StoreProvider";

export function DebugPage() {
  const [state, setState] = useStore("");

  const change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setState(() => JSON.parse(value) as never);
  };

  return (
    <PageTemplate title="Debug">
      <textarea
        style={{ width: "100%", height: "80vh" }}
        value={JSON.stringify(state, null, 2)}
        onChange={change}
      ></textarea>
    </PageTemplate>
  );
}
