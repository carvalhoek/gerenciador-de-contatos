import Grid from "@mui/material/Grid";
import Item from "@mui/material/Grid";
function Contacts() {
  return (
    <Grid container spacing={2}>
      <Grid size={4}>
        <div className="bg-amber-900">size=8</div>
      </Grid>
      <Grid size={8}>
        <Item className="bg-amber-900">size=4</Item>
      </Grid>
    </Grid>
  );
}

export default Contacts;
