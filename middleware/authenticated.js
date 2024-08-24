export default async function ({ app, redirect, route }) {
  const accessToken = await app.$cookies.get('accessToken')
  if (route.path.includes('/signin') && accessToken) {
    return redirect(`/`)
  }
  if (!route.path.includes('/signin') && !accessToken) {
    return redirect(`/signin`)
  }
}
