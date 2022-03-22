import { Link, LoaderFunction, useLoaderData } from 'remix';

import { CMS } from '~/service/cms';
import { DangerousHTML } from '~/components/DangerousHTML';
import { Log } from '~/service/logger';
import { PostDTO } from '~/service/cms/domain';
import { Routes } from '~/lib/routes';
import { useRootData } from '~/features/RootDataContext';

interface Data {
  post: PostDTO;
  id: number;
}

export const loader: LoaderFunction = async ({ params }): Promise<Data> => {
  const logger = new Log('Archive Post');
  const cms = new CMS();

  // eslint-disable-next-line operator-linebreak
  const postId =
    typeof params.slug !== 'undefined'
      ? Number.parseInt(params.slug, 10)
      : Number.NaN;

  if (Number.isNaN(postId)) {
    logger.error(`Request of resource with malformed [uri=${params.slug}]`);
    throw new Response('Invalid request', { status: 400 });
  }

  const post = await cms.getPost(postId);

  if (typeof post === 'undefined') {
    logger.error(`Unable to find post with [id=${postId}]`);
    throw new Response('Invalid request', { status: 404 });
  }

  return {
    post,
    id: postId,
  };
};

export default function Post(): JSX.Element {
  const { post } = useLoaderData<Data>();
  const { id, title, content } = post;
  const { isAuthenticated } = useRootData();

  return (
    <>
      {isAuthenticated && <Link to={`${Routes.DRAFTS}/${id}/edit`}>Edit</Link>}
      <h1>{title}</h1>
      <DangerousHTML content={content} />
    </>
  );
}
