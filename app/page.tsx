import { Metadata } from "next";
import Feed from "../components/Feed";

export const metadata: Metadata = {
  title: "PrompWorld - Website gợi ý",
  description: "Chia sẻ những ý tưởng bằng văn bản của bạn",
};

export default function Home() {
  return (
    <section className="flex-center w-full flex-col">
      <h1 className="head_text text-center">
      Website gợi ý
        <br />
        <span className="orange_gradient text-center">Chia sẻ văn bản</span>
      </h1>

      <p className="desc text-center">
      Website gợi ý là một công cụ chia sẻ văn bản mã nguồn mở dành cho thế giới hiện đại để khám phá, tạo và chia sẻ những lời nhắc sáng tạo.
      </p>

      <Feed />
    </section>
  );
}
