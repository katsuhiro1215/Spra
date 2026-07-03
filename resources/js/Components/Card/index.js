/**
 * Card Components
 *
 * 使用例:
 *
 * 1. 基本的なCard:
 * <Card variant="default">
 *   <CardTitle>タイトル</CardTitle>
 *   <p>コンテンツ</p>
 * </Card>
 *
 * 2. ヘッダー・フッター付きCard:
 * <Card
 *   header={<CardTitle>ヘッダータイトル</CardTitle>}
 *   footer={<p>フッターコンテンツ</p>}
 *   variant="primary"
 * >
 *   <p>メインコンテンツ</p>
 * </Card>
 *
 * 3. 画像付きCard:
 * <CardWithImage
 *   image="/path/to/image.jpg"
 *   imageAlt="画像の説明"
 *   imagePosition="top"
 *   header={<CardTitle>タイトル</CardTitle>}
 * >
 *   <p>コンテンツ</p>
 * </CardWithImage>
 *
 * 4. カスタム構成:
 * <Card variant="elevated" hoverable>
 *   <CardHeader>
 *     <CardTitle icon={<Icon />} subtitle="サブタイトル">
 *       メインタイトル
 *     </CardTitle>
 *   </CardHeader>
 *   <CardBody>
 *     <p>コンテンツ</p>
 *   </CardBody>
 *   <CardFooter>
 *     <button>アクション</button>
 *   </CardFooter>
 * </Card>
 */

export { default as Card } from "./Card";
export { default as CardHeader } from "./CardHeader";
export { default as CardBody } from "./CardBody";
export { default as CardFooter } from "./CardFooter";
export { default as CardTitle } from "./CardTitle";
export { default as CardWithImage } from "./CardWithImage";

export { default } from "./Card";
