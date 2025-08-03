import { toast } from "sonner";

type Props = {
  error: boolean;
  title: string;
  description?: string;
};

function ToastCard({ error, title, description }: Props) {
  return error
    ? toast.error(title, {
        description: description ?? "Server Error",
        style: {
          backgroundColor: "#F44336",
          color: "white",
          border: "1px solid #D32F2F",
        },
      })
    : toast.success(title, {
        style: {
          backgroundColor: "#4CAF50",
          color: "white",
          border: "1px solid #388E3C",
        },
      });
}

export default ToastCard;
