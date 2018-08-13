import { AuthoringModule } from './authoring.module';

describe('AuthoringModule', () => {
  let authoringModule: AuthoringModule;

  beforeEach(() => {
    authoringModule = new AuthoringModule();
  });

  it('should create an instance', () => {
    expect(authoringModule).toBeTruthy();
  });
});
