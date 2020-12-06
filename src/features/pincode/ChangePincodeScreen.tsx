import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { OnboardingScreenFrame } from 'src/components/layout/OnboardingScreenFrame'
import { ChangePincodeForm } from 'src/features/pincode/ChangePincodeForm'
import { isAccountUnlocked } from 'src/features/pincode/pincode'
import { isWalletInStorage } from 'src/features/wallet/storage'
import { Font } from 'src/styles/fonts'

export function ChangePincodeScreen() {
  const navigate = useNavigate()

  //Make sure we belong here
  useEffect(() => {
    if (!isAccountUnlocked() || !isWalletInStorage()) {
      navigate('/', { replace: true })
    }
  }, [])

  return (
    <OnboardingScreenFrame>
      <h1 css={Font.h1Green}>Change your Pincode</h1>
      <ChangePincodeForm />
    </OnboardingScreenFrame>
  )
}