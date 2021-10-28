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
