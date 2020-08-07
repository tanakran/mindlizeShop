import React from 'react';

import { Link } from 'react-router-dom';

import { Button, } from 'reactstrap';

import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Box from '@material-ui/core/Box';

import LocalGroceryStore from '@material-ui/icons/LocalGroceryStore';

import ShowDate from '../../functions/ShowDate';


const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function ProductCatalogCard(props) {
  const { propData } = props;
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  return (
    <Card className={classes.root}>
      <CardHeader

        title={propData.pd_code}
        subheader={(propData.pd_name)}
      />
      <CardMedia
        className={classes.media}
        image={propData.pd_pic}
        title={propData.pd_name}
        style={{
                marginRight:"5px",
                marginLeft:"5px"
      
              }}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          ฿{propData.pd_price_stock}
        </Typography>

        <p >
          สินค้าคงคลัง <b className="text-success"><u>{propData.pd_in_stock}</u></b> หน่วย
        </p>

        <p className="text-danger">
          {propData.pd_remark}
        </p>
        <a href={propData.pd_pic} target="_blank"><Button color="danger" size="lg" block>ดูรูปภาพขนาดใหญ่</Button></a>
      </CardContent>
      <CardActions disableSpacing>

      </CardActions>


    </Card>
  );
}