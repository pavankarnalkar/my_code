import React from "react";
import {
  Card,
  CardMedia,
  Typography,
  CardActions,
  IconButton,
  CardContent,
} from "@material-ui/core";
import { AddShoppingCart } from "@material-ui/icons";
import useStyles from "./styles";
const Product = ({ product ,onAddToCart}) => {
  const classes = useStyles();
  console.log({ product }, product, "product");
  return (
    <Card className={classes.root}>
      <CardMedia
        className={classes.media}
        image={product.media.source}
        title={product.name}
      />
      <CardContent className={classes.CardContent}>
        <Typography variant="h5" gutterBottom>
          {product.name}
        </Typography>
        <Typography variant="h5">
          {product.price.formatted_with_symbol}
        </Typography>
        <Typography
          variant="body2"
          dangerouslySetInnerHTML={{ __html: product.description }}
          color="textSecondary"
        />
      </CardContent>
      <CardActions disableSpacing className={classes.cardActions} onClick={()=> onAddToCart(product.id,1)}>
        <IconButton aria-label="Aadd to Card">
          <AddShoppingCart />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default Product;
