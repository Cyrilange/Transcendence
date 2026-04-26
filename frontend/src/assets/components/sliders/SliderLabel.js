import Slider from '@mui/joy/Slider';

function valueText(value) {
  return `${value}`;
}

export default function SliderLabel() {
  return (
    <div style={{ width: '100%', padding: '3px'}}>
      <Slider
        aria-label="Custom marks"
       	defaultValue={20}
        min={10}
        max={30}
        step={1}
        getAriaValueText={valueText}
        valueLabelDisplay="true"
        
      />
    </div>
  );
}
