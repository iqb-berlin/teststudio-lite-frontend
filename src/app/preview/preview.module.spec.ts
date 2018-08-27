import { PreviewModule } from './preview.module';

describe('PreviewModule', () => {
  let previewModule: PreviewModule;

  beforeEach(() => {
    previewModule = new PreviewModule();
  });

  it('should create an instance', () => {
    expect(previewModule).toBeTruthy();
  });
});
