import { Router } from 'express'

const router = Router()

router.post('/clients', (req, res) => {
  console.log(req)
  res.send('ok')
})

export default router