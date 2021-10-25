JSX:
<div>Hello</div>

=>
  React.createElement('div', {}, [React.createText('Hello')]);
  =>

JSON:
{ tag: 'div', props: {}, children: [{ tag: null, type: 'textnode', children: 'Hello' }] }

  =>

HTML:

<div>Hello</div>


{ op: 'strokeStyle', props: { value: '#f0f' }, children: [] }

Hello, my name is alex

Hello, my name is Ben,
  you murdered my family and I will have revenge in this life or the nex

Im going to get a coffe now
Im a tea person
