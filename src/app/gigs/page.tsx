import Grid from '@/components/ui/uiGrid/Grid';
import Card from '@/components/ui/uiCard/Card';


const Gig = () => {

  const cardList = []

  for(let i=0;i<6;i++){
    cardList.push(<Card key={i} content={(i+1).toString()}/>)
  }

  return (
    <>
      <Grid>
        {cardList}
      </Grid>
    </>
  )
}

export default Gig;