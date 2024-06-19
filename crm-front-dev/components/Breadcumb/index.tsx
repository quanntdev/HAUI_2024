import styles from "./styles.module.scss";
import Link from "@mui/material/Link";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Typography } from "@mui/material";
import { useRouter } from "next/router";
import useTrans from "../../utils/useTran";

const Breadcrumb = (props: any) => {
  const trans = useTrans();
  const router = useRouter();
  const redirectTo = (url: string) => {
    router.push(url);
  };

  const { title, icon, prevPage = null } = props;
  return (
    <>
      <div
        style={{ borderRadius: "12px 12px 0 0" }}
        className={`${styles.breadcrumb} bg-white`}
      >
        <div className={styles["breadcrumb-left"]}>
          {icon}
          <h2 className="p-0 m-0">
            <span>{title}</span>
          </h2>
        </div>
        <Breadcrumbs
          aria-label="breadcrumb"
          className={styles["breadcrumb-right"]}
        >
          <Link
            underline="hover"
            color="inherit"
            className="text-cursor"
            onClick={(e) => {
              e.stopPropagation();
              redirectTo("/");
            }}
          >
            {trans.home.dashboard}
          </Link>
          {prevPage && (
            <Link
              underline="hover"
              color="inherit"
              className="text-cursor"
              onClick={(e) => {
                e.stopPropagation();
                redirectTo(`/${prevPage?.toLowerCase()}`);
              }}
            >
              {prevPage}
            </Link>
          )}

          <Typography color="text.primary">{title}</Typography>
        </Breadcrumbs>
      </div>
    </>
  );
};

export default Breadcrumb;
