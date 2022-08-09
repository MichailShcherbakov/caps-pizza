import {
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import AppPage from "~/common/interfaces/app-page.interface";
import AdminPanelLayout from "~/layouts/admin-panel";
import {
  useDeleteProductCategoryMutation,
  useGetProductCategoriesQuery,
} from "~/services/product-categories.service";
import ExternalSvg from "~/ui/components/external-svg";
import CreateProductCategoryModal from "./components/modal";

export const ProductCategoriesPage: AppPage = () => {
  const {
    data: productCategories,
    isLoading,
    isError,
  } = useGetProductCategoriesQuery();
  const [deleteProductCategory] = useDeleteProductCategoryMutation();

  if (isLoading || isError || !Array.isArray(productCategories)) return null;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>UUID</TableCell>
            <TableCell>Изображение</TableCell>
            <TableCell>Название</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productCategories.map(c => (
            <TableRow key={c.uuid}>
              <TableCell>{c.uuid}</TableCell>
              <TableCell>
                <Stack direction="row" alignItems="center">
                  <ExternalSvg
                    src={`${process.env.NEXT_PUBLIC_IMAGES_SOURCE_URL}${c.image_url}`}
                    className="ui-w-12 ui-h-12"
                  />
                </Stack>
              </TableCell>
              <TableCell>{c.name}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => deleteProductCategory({ uuid: c.uuid })}
                >
                  Удалить
                </Button>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell>
              <CreateProductCategoryModal />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

ProductCategoriesPage.getLayout = page => {
  return <AdminPanelLayout>{page}</AdminPanelLayout>;
};

export default ProductCategoriesPage;
