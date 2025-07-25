import Grid from '@/components/ui/uiGrid/Grid';
import Card from '@/components/ui/uiCard/Card';


const Gig = () => {

  const cardList = [];

  for (let i = 0; i < 6; i++) {
    cardList.push(<Card
      key={i}
      cardTitle = 'cardTitle' 
      cardDescription = 'cardDescription' 
      cardAction = 'cardAction' 
      cardContent = 'cardContent' 
      cardFooter = 'cardFooter'
      />);
  }

  return (
    <>
      <Grid>
        {cardList}
      </Grid>
    </>
  );
};

export default Gig;