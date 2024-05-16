import { Box, Card, CardContent, Collapse, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material"
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
                <Typography align="center" className="!leading-none !p-0 !m-0 !text-3xl md:!text-5xl">Mikrotik Burst Limit Calculator</Typography>
              </div>
              <div className="flex flex-col md:flex-row gap-10 w-full">
                <div className="flex flex-col gap-5 w-full">
                  <Typography className="!text-xl md:!text-3xl" align="center">CONFIGURATION</Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell className="!border !border-gray-300" align="center">UPLOAD</TableCell>
                        <TableCell className="!border !border-gray-300" align="center">DOWNLOAD</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell className="!border !border-gray-300">
                          <TextField fullWidth variant="outlined" label="Max Limit (K/M)" value={form.speedUpload} name="speedUpload" onChange={handleChange} />
                        </TableCell>
                        <TableCell className="!border !border-gray-300">
                          <TextField fullWidth variant="outlined" label="Max Limit (K/M)" value={form.speedDownload} name="speedDownload" onChange={handleChange} />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="!border !border-gray-300">
                          <TextField fullWidth variant="outlined" label="Burst Limit (K/M)" value={form.bonusUpload} name="bonusUpload" onChange={handleChange} />
                        </TableCell>
                        <TableCell className="!border !border-gray-300">
                          <TextField fullWidth variant="outlined" label="Burst Limit (K/M)" value={form.bonusDownload} name="bonusDownload" onChange={handleChange} />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="!border !border-gray-300">
                          <TextField fullWidth type="number" variant="outlined" label="Burst Duration (Seconds)" value={form.bonusUploadDuration} name="bonusUploadDuration" onChange={handleChange} />
                        </TableCell>
                        <TableCell className="!border !border-gray-300">
                          <TextField fullWidth type="number" variant="outlined" label="Burst Duration (Seconds)" value={form.bonusDownloadDuration} name="bonusDownloadDuration" onChange={handleChange} />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <div className="flex flex-col gap-5 w-full">
                  <Typography className="!text-xl md:!text-3xl" align="center">CALCULATION RESULTS</Typography>
                  <div className="flex flex-col gap-1">
                    <Typography>FOR QUEUE (SIMPLE/TREE)</Typography>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell className="!border !border-gray-300" align="center">SETTINGS</TableCell>
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
                  <div className="flex flex-col gap-1 relative">
                    <Typography>FOR HOTSPOT OR PPPOE</Typography>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell className="!border !border-gray-300">Rate Limit (click to copy)</TableCell>
                          <TableCell align="center" className="!border !border-gray-300 !bg-sky-100 cursor-pointer hover:!bg-sky-200" title="Click to copy" onClick={handleCopy}>{rateString}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    <Collapse in={copied} className="absolute right-0 -bottom-7">
                      <span className="flex gap-1 items-center justify-end text-emerald-500"><CheckCircle fontSize="small" /> Copied</span>
                    </Collapse>
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
