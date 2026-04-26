import Slider from '@mui/joy/Slider';

const marks = [
  {
	value: 2,
	label: '2',
  },
  {
	value: 3,
	label: '3',
  },
  {
	value: 4,
	label: '4',
  },
  {
	value: 5,
	label: '5',
  },

];

/* function valueText(value) {
  return `${value}`;
} */

export default function SliderSteps() {
  return (
   // <div style={{ width: '100%', padding: '3px'}}>
      <Slider 
        id="playerNbr"
        aria-label="Custom marks"
       	defaultValue={2}
        min={2}
        max={5}
        step={1}
		//	getAriaValueText={valueText}
        valueLabelDisplay="off"
        marks={marks}
      />
//    </div>
  );
}
