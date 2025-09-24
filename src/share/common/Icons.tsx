import '@flaticon/flaticon-uicons/css/all/all.css';

type Props =
  | {
      w?: 'bold' | 'solid' | 'regular' | 'thin';
      t?: 'round' | 'straight';
      name: string;
      size?: number;
    }
  | {
      w: 'brands';
      t?: never;
      name: string;
      size?: number;
    };

function Icons(props: Props) {
  const { size = 16 } = props;
  if (props.w === 'brands') {
    return (
      <i
        className={`fi fi-brands-${props.name}`}
        style={{
          fontSize: size,
          height: size,
        }}
      ></i>
    );
  } else {
    const { w = 'solid', t = 'round' } = props;
    return (
      <i
        className={`fi fi-${w[0]}${t[0]}-${props.name}`}
        style={{
          fontSize: size,
          height: size,
        }}
      ></i>
    );
  }
}

export default Icons;
