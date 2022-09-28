/* eslint-disable @next/next/no-img-element */

import { FunctionComponent } from 'react';

/* eslint-disable jsx-a11y/alt-text */
const AlphabetPdf: FunctionComponent<{ title: string }> = ({ title }) => (
  <div>
    <h1>{title}</h1>
    <img src="https://cdn.pixabay.com/photo/2016/09/21/04/46/barley-field-1684052_1280.jpg" width="300px" />
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Purus non
      enim praesent elementum facilisis leo vel. Sodales ut eu sem integer vitae justo. Duis ultricies lacus sed turpis tincidunt id. Non
      arcu risus quis varius quam. Etiam non quam lacus suspendisse faucibus interdum posuere lorem ipsum. Feugiat vivamus at augue eget
      arcu. Aliquet porttitor lacus luctus accumsan tortor posuere ac ut consequat. Eget lorem dolor sed viverra ipsum nunc aliquet
      bibendum. Varius duis at consectetur lorem donec massa sapien faucibus et. Consequat nisl vel pretium lectus. Vitae suscipit tellus
      mauris a. Mauris nunc congue nisi vitae suscipit.
    </p>
  </div>
);

export default AlphabetPdf;
