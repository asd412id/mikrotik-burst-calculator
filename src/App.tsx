import { Box, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material"
import { CalculatedRates, SpeedRates, calculateRates, convertToString, rateLimit } from "./utils/burstCalculation";
import { ChangeEvent, useEffect, useState } from "react";
import { CheckCircle } from "@mui/icons-material";
import logo from './assets/logo.jpeg';

function App() {
  const [form, setForm] = useState<SpeedRates>({
    speedUpload: '512K',
    speedDownload: '1M',
    bonusUpload: '1M',
    bonusDownload: '2M',
    bonusUploadDuration: 8,
    bonusDownloadDuration: 8
  })

  const [rates, setRates] = useState<Partial<CalculatedRates>>();
  const [rateString, setRateString] = useState('')
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rateString);
      setCopied(true);
    } catch (err) {
      console.error('Failed to copy text:', err);
    } finally {
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    calculateRate()
  }, [form])

  const calculateRate = () => {
    const calculate = calculateRates(form)
    setRates(calculate)
    setRateString(rateLimit(calculate))
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value.toUpperCase() })
  }

  return (
    <Box className="flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-300 p-3" sx={{ minHeight: '100dvh' }}>
      <div className="flex w-full lg:max-w-screen-xl">
        <Card elevation={5} className="w-full">
          <CardContent className="!p-5 md:!p-10">
            <div className="flex flex-col gap-10">
              <div className="flex flex-col md:flex-row items-center justify-center gap-3">
                <img src={logo} alt="logo" className="w-16 rounded-lg" />
                <Typography align="center" className="!leading-none !p-0 !m-0 !text-3xl md:!text-5xl">Mikrotik Burst Limit Kalkulator</Typography>
              </div>
              <div className="flex flex-col md:flex-row gap-10 w-full">
                <div className="flex flex-col gap-5 w-full">
                  <Typography className="!text-xl md:!text-3xl" align="center">KONFIGURASI</Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell className="!border !border-gray-300" align="center">TARGET UPLOAD</TableCell>
                        <TableCell className="!border !border-gray-300" align="center">TARGET DOWNLOAD</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell className="!border !border-gray-300">
                          <TextField fullWidth variant="outlined" label="KECEPATAN UPLOAD (K/M)" value={form.speedUpload} name="speedUpload" onChange={handleChange} />
                        </TableCell>
                        <TableCell className="!border !border-gray-300">
                          <TextField fullWidth variant="outlined" label="KECEPATAN DOWNLOAD (K/M)" value={form.speedDownload} name="speedDownload" onChange={handleChange} />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="!border !border-gray-300">
                          <TextField fullWidth variant="outlined" label="BONUS UPLOAD (K/M)" value={form.bonusUpload} name="bonusUpload" onChange={handleChange} />
                        </TableCell>
                        <TableCell className="!border !border-gray-300">
                          <TextField fullWidth variant="outlined" label="BONUS DOWNLOAD (K/M)" value={form.bonusDownload} name="bonusDownload" onChange={handleChange} />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="!border !border-gray-300">
                          <TextField fullWidth type="number" variant="outlined" label="DURASI BONUS UPLOAD (DETIK)" value={form.bonusUploadDuration} name="bonusUploadDuration" onChange={handleChange} />
                        </TableCell>
                        <TableCell className="!border !border-gray-300">
                          <TextField fullWidth type="number" variant="outlined" label="DURASI BONUS DOWNLOAD (DETIK)" value={form.bonusDownloadDuration} name="bonusDownloadDuration" onChange={handleChange} />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <div className="flex flex-col gap-5 w-full">
                  <Typography className="!text-xl md:!text-3xl" align="center">HASIL KALKULASI</Typography>
                  <div className="flex flex-col gap-1">
                    <Typography>PENGATURAN QUEUE</Typography>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell className="!border !border-gray-300" align="center">PENGATURAN</TableCell>
                          <TableCell className="!border !border-gray-300" align="center">UPLOAD</TableCell>
                          <TableCell className="!border !border-gray-300" align="center">DOWNLOAD</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell className="!border !border-gray-300">Max Limit</TableCell>
                          <TableCell align="center" className="!border !border-gray-300">{convertToString(rates?.maxUploadLimit ?? 0)}</TableCell>
                          <TableCell align="center" className="!border !border-gray-300">{convertToString(rates?.maxDownloadLimit ?? 0)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="!border !border-gray-300">Burst Limit</TableCell>
                          <TableCell align="center" className="!border !border-gray-300">{convertToString(rates?.burstUploadLimit ?? 0)}</TableCell>
                          <TableCell align="center" className="!border !border-gray-300">{convertToString(rates?.burstDownloadLimit ?? 0)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="!border !border-gray-300">Burst Threshold</TableCell>
                          <TableCell align="center" className="!border !border-gray-300">{convertToString(rates?.burstUploadThreshold ?? 0)}</TableCell>
                          <TableCell align="center" className="!border !border-gray-300">{convertToString(rates?.burstDownloadThreshold ?? 0)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="!border !border-gray-300">Burst Time</TableCell>
                          <TableCell align="center" className="!border !border-gray-300">{rates?.burstTimeUpload ?? 0}</TableCell>
                          <TableCell align="center" className="!border !border-gray-300">{rates?.burstTimeDownload ?? 0}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="!border !border-gray-300">Limit At</TableCell>
                          <TableCell align="center" className="!border !border-gray-300">{convertToString(rates?.limitAtUpload ?? 0)}</TableCell>
                          <TableCell align="center" className="!border !border-gray-300">{convertToString(rates?.limitAtDownload ?? 0)}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Typography>PENGATURAN HOTSPOT ATAU PPPOE</Typography>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell className="!border !border-gray-300">Rate Limit</TableCell>
                          <TableCell align="center" className="!border !border-gray-300 !bg-sky-100 cursor-pointer hover:!bg-sky-200" title="Klik untuk menyalin" onClick={handleCopy}>{rateString}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    {copied && <span className="flex gap-1 items-center justify-end text-emerald-500"><CheckCircle fontSize="small" /> Berhasil disalin</span>}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Box>
  )
}

export default App
