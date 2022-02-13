import { BadRequest } from './BadRequest';
import { LayoutWrapper } from '../LayoutWrapper';
import { Log } from '~/service/logger';
import { NotFound } from './NotFound';
import { Unauthorized } from './Unauthorized';
import { useCatch } from 'remix';

function getExceptionMessage(status: number): JSX.Element {
  switch (status) {
    case 400:
      return <BadRequest />;
    case 401:
      return <Unauthorized />;
    case 404:
      return <NotFound />;
    default:
      return <h1>{status}: We can't process your request!</h1>;
  }
}

export function Multiplexer() {
  const logger = new Log('CatchBoundary');
  const caught = useCatch();
  let children = getExceptionMessage(caught.status);
  logger.error(`[status=${caught.status}]`, `[data=${caught.data}]`);
  return <LayoutWrapper>{children}</LayoutWrapper>;
}
