import Image from "next/image";
import defaultAvatar from "../../assets/images/no_image.png";

const ImageBase = (props: any) => {
  const { src, width, height, styles, layout = null, alt = null } = props;

  return (
    <Image
      className={styles}
      width={width}
      height={height}
      src={src || defaultAvatar}
      alt={alt ?? 'image'}
      layout={layout}
    />
  );
};

export default ImageBase;
