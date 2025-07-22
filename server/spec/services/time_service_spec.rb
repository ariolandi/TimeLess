require "rails_helper"

RSpec.describe TimeService do
  context "parses successfully" do
    it "a string" do
      time = TimeService.new("09:15")

      expect(time.hours).to eq(9)
      expect(time.minutes).to eq(15)
    end

    it "nil" do
      time = TimeService.new(nil)

      expect(time.hours).to eq(0)
      expect(time.minutes).to eq(0)
    end
  end

  context "raises an error" do
    it "for other types" do
      expect{ TimeService.new(9) }.to raise_error(TypeError)
    end

    it "for wrong format" do
      expect{ TimeService.new("0900") }.to raise_error(ArgumentError)
    end

    it "for negative time" do
      expect{ TimeService.new("-09:00") }.to raise_error(ArgumentError)
    end
  end

  context "parses correctly to minutes" do
    it "when only minutes" do
      time = TimeService.new("00:15")

      expect(time.to_minutes).to eq(15)
    end

    it "when hours and minutes" do
      time = TimeService.new("02:15")

      expect(time.to_minutes).to eq(135)
    end
  end

  context "parses correctly to datetime" do
    it "when only minutes" do
      time = TimeService.new(nil)

      expect(time.to_datetime).to eq("2000-01-01 00:00")
    end

    it "when hours and minutes" do
      time = TimeService.new("02:15")

      expect(time.to_datetime).to eq("2000-01-01 02:15")
    end
  end

  context "operates with time correctly" do
    it "when addiction" do
      time = TimeService.new("09:15")
      added = TimeService.new("01:15")
      expected = TimeService.new("10:30")

      expect(time + added).to eq(expected)
    end

    it "when subtraction" do
      time = TimeService.new("09:15")
      subtracted = TimeService.new("01:15")
      expected = TimeService.new("08:00")

      expect(time - subtracted).to eq(expected)
    end

    it "when calculates duration" do
      starting = TimeService.new("09:15")
      ending = TimeService.new("10:00")
      expected = TimeService.new("00:45")

      expect(TimeService.duration(starting, ending)).to eq(expected)
    end
  end
end