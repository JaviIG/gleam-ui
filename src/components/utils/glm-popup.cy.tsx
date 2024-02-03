import GlmPopup from './glm-popup.vue';
import { ref } from 'vue';

type Position =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center-center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

type RenderFloatingOptions = {
  position: Position;
  horizontalAlignment: 'start' | 'center' | 'end';
  verticalAlignment: 'start' | 'center' | 'end';
  width: number;
  height: number;
};

function renderFloating({
  position,
  horizontalAlignment,
  verticalAlignment,
  width,
  height,
}: RenderFloatingOptions) {
  cy.viewport(600, 600);
  cy.mount({
    setup() {
      const childRef = ref<HTMLElement>();
      const referenceRef = ref<HTMLElement>();
      return () => (
        <div
          class="layout"
          style={{
            display: 'grid',
            gridTemplateAreas:
              '"top-left top-center top-right" "center-left center center-right" "bottom-left bottom-center bottom-right"',
            gridTemplateColumns: '1fr 1fr 1fr',
            gridTemplateRows: '1fr 1fr 1fr',
            height: '100vh',
            alignItems: verticalAlignment,
            justifyItems: horizontalAlignment,
          }}
        >
          <div
            class="wrapper"
            style={{ position: 'relative', display: 'flex', gridArea: position }}
          >
            <button
              class="reference"
              ref={referenceRef}
              style={{ width: '50px', height: '50px', background: 'red' }}
            />
            <GlmPopup
              class="target"
              trigger={referenceRef.value}
              style={{
                position: 'absolute',
                width: `${width}px`,
                height: `${height}px`,
                background: 'blue',
              }}
              ref={childRef}
            />{' '}
          </div>
        </div>
      );
    },
  });
  return {
    get target() {
      return cy.get('.target');
    },
  };
}

describe('useFloating()', () => {
  it('positions correctly top-left: aligns to the left', () => {
    const floating = renderFloating({
      position: 'top-left',
      horizontalAlignment: 'start',
      verticalAlignment: 'start',
      width: 200,
      height: 200,
    });

    floating.target.invoke('offset').should('deep.equal', { top: 50, left: 0 });
  });

  // it('positions correctly top-center reduces width on the left', () => {
  //   const floating = renderFloating({
  //     position: 'top-center',
  //     horizontalAlignment: 'start',
  //     width: 250,
  //     height: 250,
  //   });
  //
  //   floating.target.invoke('offset').should('deep.equal', { top: 49, left: 0 });
  // });
  //
  // it('positions correctly top-center: reduces width on the right', () => {
  //   const floating = renderFloating({
  //     position: 'top-center',
  //     horizontalAlignment: 'end',
  //     width: 250,
  //     height: 250,
  //   });
  //
  //   floating.target.invoke('offset').should('deep.equal', { top: 49, left: 0 });
  // });

  it('positions correctly top-right: aligns to the right', () => {
    const floating = renderFloating({
      position: 'top-right',
      horizontalAlignment: 'end',
      verticalAlignment: 'start',
      width: 200,
      height: 200,
    });

    floating.target.invoke('offset').should('deep.equal', { top: 50, left: 400 });
  });

  it('positions correctly bottom-left: aligns to the left', () => {
    const floating = renderFloating({
      position: 'bottom-left',
      horizontalAlignment: 'start',
      verticalAlignment: 'end',
      width: 200,
      height: 200,
    });

    floating.target.invoke('offset').should('deep.equal', { top: 350, left: 0 });
  });

  it('positions correctly bottom-right: aligns to the right', () => {
    const floating = renderFloating({
      position: 'bottom-right',
      horizontalAlignment: 'end',
      verticalAlignment: 'end',
      width: 200,
      height: 200,
    });

    floating.target.invoke('offset').should('deep.equal', { top: 350, left: 400 });
  });
});
